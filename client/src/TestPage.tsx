import { useEffect, useState } from 'react';

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        console.log('Auth data:', data);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Auth error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
