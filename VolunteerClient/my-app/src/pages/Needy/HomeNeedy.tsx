import { useEffect } from 'react';

export const HomeNeedy = () => {
  useEffect(() => {
    document.title = 'Home - Needy';
  }, []);

  return (
    <div>
      <h1>Needy Home</h1>
      <p>Welcome to the Needy home page!</p>
    </div>
  );
};
