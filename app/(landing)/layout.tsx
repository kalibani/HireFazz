const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full overflow-auto bg-white">
      <div>{children}</div>
    </main>
  );
};

export default LandingLayout;
