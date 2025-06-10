import './App.css';
import Blog from './blog';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Blog author="Me" date="May 1st, 2025">
          <p>This is my <strong>first blog post</strong> using children in React.</p>
        </Blog>
        <Blog author="lxy" date="May 2nd, 2025">
          <p>Blog post by lxy.</p>
        </Blog>
        <Blog author="Erika" date="May 3rd, 2025">
          <p>I want help in PBL... </p>
        </Blog>
        <Blog author="Justin" date="May 12th, 2025">
          <p>I play Valorant.</p>
        </Blog>
      </header>
    </div>
  );
}

export default App;
