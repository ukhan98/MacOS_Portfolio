import { Dock, Navbar, Welcome } from "#components"; //dont need multiple import lines because of index.js in the components folder

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />
    </main>
  );
};

export default App;
