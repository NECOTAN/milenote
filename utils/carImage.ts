import type { CSSProperties } from "react"

// 車両画像の位置、ズーム設定
export type CarImageTransform = {
  image_position_x?: number | null
  image_position_y?: number | null
  image_scale?: number | null
}

// 位置、ズームのデフォルト値
export const DEFAULT_IMAGE_POSITION_X = 50
export const DEFAULT_IMAGE_POSITION_Y = 50
export const DEFAULT_IMAGE_SCALE = 1

// ズームの許容範囲
export const MIN_IMAGE_SCALE = 1
export const MAX_IMAGE_SCALE = 3

// 位置を 0〜100 の整数に丸める
export const clampImagePosition = (value: number): number => {
  if (!Number.isFinite(value)) return DEFAULT_IMAGE_POSITION_X
  return Math.round(Math.min(100, Math.max(0, value)))
}

// ズームを許容範囲内、小数2桁に丸める
export const clampImageScale = (value: number): number => {
  if (!Number.isFinite(value)) return DEFAULT_IMAGE_SCALE
  const clamped = Math.min(MAX_IMAGE_SCALE, Math.max(MIN_IMAGE_SCALE, value))
  return Math.round(clamped * 100) / 100
}

// 車両画像の表示スタイル（object-position 、 scale）を生成する
// プレビュー、ガレージ、ホームの3箇所で共用し、見え方を必ず一致させる
// 既存ユーザーは値が NULL の可能性があるため ?? でデフォルトにフォールバックする（0 を誤変換しないよう || は使わない）
// transform-origin も位置に合わせることで、object-position がはみ出さない軸（縦長/横長画像の短辺方向）でも
// ズーム時に左右、上下どちらも狙った位置へ寄せられるようにする
export const getCarImageStyle = (car: CarImageTransform): CSSProperties => {
  const x = car.image_position_x ?? DEFAULT_IMAGE_POSITION_X
  const y = car.image_position_y ?? DEFAULT_IMAGE_POSITION_Y
  const scale = car.image_scale ?? DEFAULT_IMAGE_SCALE
  return {
    objectPosition: `${x}% ${y}%`,
    transform: `scale(${scale})`,
    transformOrigin: `${x}% ${y}%`,
  }
}