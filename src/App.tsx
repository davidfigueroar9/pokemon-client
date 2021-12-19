import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="flex flex-1 items-center justify-center flex-col">
        <img src={logo} className="w-56" alt="logo" />
        <Counter />
        <p className="text-lg mt-6">
          Edit <code className="font-mono">src/App.tsx</code> and save to
          reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="text-blue-500 hover:text-blue-700"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="text-blue-500 hover:text-blue-700"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="text-blue-500 hover:text-blue-700"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="text-blue-500 hover:text-blue-700"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;
