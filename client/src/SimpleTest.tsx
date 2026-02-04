export default function SimpleTest() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>
        Hello World - This is a test!
      </h1>
      <p>If you can see this, React is working.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}
