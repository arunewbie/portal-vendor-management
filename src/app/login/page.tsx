export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-white p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">FII Supplier Portal</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Login</h1>
        <p className="mt-2 text-sm text-slate-500">Masuk untuk mengelola order, planning, receiving, dan report.</p>
        <form action="/api/auth/login" method="post" className="mt-8 space-y-4">
          <input className="input" name="email" placeholder="Email" />
          <input className="input" name="password" placeholder="Password" type="password" />
          <button className="btn-primary w-full" type="submit">Login</button>
        </form>
      </div>
    </main>
  );
}
