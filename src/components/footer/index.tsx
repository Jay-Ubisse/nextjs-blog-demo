export const Footer = () => {
    return (
        
      <footer className="bg-slate-200 p-4 text-center">
        <div className="container mx-auto">
          <p className="text-gray-700">© {new Date().getFullYear()} Seu Blog. Todos os direitos reservados.</p>
          <nav className="mt-2">
            <ul className="flex justify-center space-x-4">
              <li><a href="/sobre" className="text-blue-600 hover:underline">Sobre</a></li>
              <li><a href="/contato" className="text-blue-600 hover:underline">Contato</a></li>
              <li><a href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    );
  };
  