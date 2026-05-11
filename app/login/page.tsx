"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/lib/i18n"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { t } = useTranslation()

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else router.push("/")
    setLoading(false)
  }

  // 新規登録処理
  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { display_name: email.split('@')[0] } } // メールの@前を表示名にする
    })
    if (error) alert(error.message)
    else alert(t("login.confirmation_sent"))
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Milenote</CardTitle>
          <CardDescription className="text-center">{t("login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input id="email" type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full font-bold" type="submit" disabled={loading}>
              {loading ? t("login.processing") : t("login.login")}
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={handleSignUp} disabled={loading}>
              {t("login.signup")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}