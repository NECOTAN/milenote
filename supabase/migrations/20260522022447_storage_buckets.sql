-- Storage バケット作成
-- cars バケット：車両画像保存用（公開バケット）
-- ファイルパス構造: {user_id}/{car_id}-{timestamp}.{ext}

insert into storage.buckets (id, name, public)
values ('cars', 'cars', true)
on conflict (id) do nothing;