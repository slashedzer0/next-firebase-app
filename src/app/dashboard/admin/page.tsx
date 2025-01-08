export default function AdminDashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Overview</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border bg-background">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Hi from /admin!</h3>
          <p className="text-sm text-muted-foreground">
            Add components here.
          </p>
        </div>
      </div>
    </>
  )
}
