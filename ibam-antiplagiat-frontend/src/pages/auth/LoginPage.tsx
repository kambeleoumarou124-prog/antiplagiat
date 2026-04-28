import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      console.log('Login response:', res);
      console.log('Response data:', res.data);
      console.log('Access token:', res.data?.access);
      console.log('Refresh token:', res.data?.refresh);
      console.log('User:', res.data?.user);
      
      if (res.data?.access && res.data?.refresh) {
        setTokens(res.data.access, res.data.refresh);
        if (res.data?.user) {
          setUser(res.data.user);
        }
        console.log('Tokens set, navigating to /');
        navigate("/");
      } else {
        console.error('Invalid response structure:', res);
        setErrorMsg("Réponse serveur invalide");
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      const status = error.response?.status;
      if (status === 401) {
        setErrorMsg("Email ou mot de passe incorrect");
      } else if (status === 429) {
        setErrorMsg("Trop de tentatives. Veuillez patienter.");
      } else {
        setErrorMsg("Une erreur est survenue lors de la connexion");
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMsg("");
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md">
      {/* IBAM Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#1A3A5C] flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="font-serif text-3xl font-bold text-white tracking-widest">IBAM</span>
        </div>
        <h1 className="text-2xl font-serif text-[#1A3A5C] font-bold tracking-wide">Anti-Plagiat</h1>
        <p className="text-sm text-slate-500 mt-1">Institut Burkinabè des Arts et Métiers</p>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-[#1A3A5C] tracking-tight mb-2">Connexion</h2>
        <p className="text-slate-500 text-sm">Promotion 2025-2026</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {errorMsg}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">Adresse email</Label>
        <Input
          id="email"
          type="email"
          placeholder="etudiant@ibam.bf"
          className="border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 text-base"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-semibold text-foreground">Mot de passe</Label>
          <a href="/mot-de-passe-oublie" className="text-xs text-primary hover:text-primary-light hover:underline transition-colors font-medium">
            Mot de passe oublié ?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 text-base"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#1A3A5C] hover:bg-[#0F2840] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-12 rounded-xl text-base"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connexion en cours...
          </span>
        ) : "Se connecter"}
      </Button>
      </form>
    </div>
  );
}
