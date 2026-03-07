import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Paths } from '../../routes/paths';

export const HomeVolunteer = () => {
  useEffect(() => {
    document.title = 'Home - Volunteer';
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <h1>Volunteer Home</h1>
      <p>Welcome to the Volunteer home page!</p>
    
    </div>
  );
};