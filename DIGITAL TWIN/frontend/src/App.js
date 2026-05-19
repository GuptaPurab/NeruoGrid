import "@/App.css";

function App() {
  return (
    <div className="App" data-testid="app-container">
      <iframe
        data-testid="neurogrid-iframe"
        src="/neurogrid.html"
        title="NeuroGrid - Intelligent Power Grid"
        className="neurogrid-frame"
      />
    </div>
  );
}

export default App;
