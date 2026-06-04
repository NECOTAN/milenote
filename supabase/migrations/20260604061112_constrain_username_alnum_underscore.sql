-- users.username を「英数字とアンダースコアのみ」に制限する
-- あわせて、新規登録トリガーが入力されたユーザーIDを username に保存するよう修正する
-- （従来はメールアドレスを username に保存しており、制約と衝突するため）

-- 1. 新規ユーザー作成トリガーを修正
--    入力されたユーザーID(raw_user_meta_data->>'username')を username に保存する。
--    未指定時の安全策として、メールのローカル部を英数字と_以外を_に置換して使用する。
CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
declare
  v_username text;
begin
  v_username := coalesce(
    nullif(new.raw_user_meta_data->>'username', ''),
    regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g')
  );
  insert into public.users (id, username, display_name)
  values (
    new.id,
    v_username,
    coalesce(new.raw_user_meta_data->>'display_name', v_username)
  );
  return new;
end;
$$;

-- 2. 既存の username を制約に適合する形へ正規化する
--    （英数字と_以外を_へ置換。テストデータのみのため行は削除しない）
UPDATE public.users
SET username = regexp_replace(username, '[^a-zA-Z0-9_]', '_', 'g')
WHERE username !~ '^[a-zA-Z0-9_]+$';

-- 3. CHECK制約を追加（フロント側の検証 ^[a-zA-Z0-9_]+$ と一致）
ALTER TABLE public.users
  ADD CONSTRAINT users_username_format_check
  CHECK (username ~ '^[a-zA-Z0-9_]+$');