import { useState, type FormEvent } from 'react';
import { data, Link, useNavigate } from 'react-router';
import { setSession } from '../auth/auth.utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  register as registerService,
} from '../services/auth.service';
import {type RegisterType} from '../types/auth.types';
import { Paths } from '../routes/paths';
import { useAuthContext } from '../auth/useAuthContext';
import { UserRole } from '../types/enums.types';

export const RegisterPage = () => {
  useDocumentTitle('Register');
  const navigate = useNavigate()
  const { setUser } = useAuthContext()
  
  const register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data: RegisterType = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      adress: formData.get("adress") as string,
      userRole: Number(formData.get("role")),
      categoryIds: [],      // אם אין בחירה בשלב זה
      availabilities: []   // אם אין בחירה בשלב זה
    };
    const user = await registerService({ ...data, userRole: data.userRole });
    setSession(user.token);
    setUser(user)
    //navigate(/${Paths.home})
  };

    return (
        <form onSubmit={register}>
          <input name='fullName' placeholder='Full Name' />
          <input type='email' name='email' placeholder='Email' />
          <input type="password" name="password" placeholder="Password" required/>
          <input type='tel' name='phone' placeholder='Email' />
          <input type="text" name='adress' placeholder='Adress' />
          <div>
            <label>
             <input type="radio" name="role" value={UserRole.Volunteer} defaultChecked />
              Volunteer
             </label>
           <label>
            <input type="radio" name="role" value={UserRole.Needy} />
             Request Help
           </label>
          </div>
          
      
          <button type="submit">Register</button>
          <span>
            already have an account? <Link to={Paths.login}>login</Link>
          </span>
        </form>
      );
}