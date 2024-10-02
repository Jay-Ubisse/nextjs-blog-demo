

const PagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen text-primary">
      <main className="flex flex-1">{children}</main>
    </div>
  );
};

export default PagesLayout;
