import { Session } from '@supabase/supabase-js';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LoginFormData } from '../pages/LoginPage.tsx';
import { SignupFormData } from '../pages/SignupPage.tsx';
import { axiosInstance } from '../utils/axios-instance.ts';
import { supabase } from '../utils/supabase-client.ts';

type UserContextType = {
  session: Session | null;
  createAccount: ({}: SignupFormData) => Promise<boolean>;
  login: ({}: LoginFormData) => Promise<boolean>;
};

const UserContext = createContext<UserContextType>({
  session: null,
  createAccount: async () => false,
  login: async () => false,
});

/**
 * Context for User data
 */
export function UserContextProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${session.access_token}`;
      }
      // if (event === 'INITIAL_SESSION') {
      //   // handle initial session
      // } else if (event === 'SIGNED_IN') {
      //   // handle sign in event
      // } else if (event === 'SIGNED_OUT') {
      //   // handle sign out event
      // } else if (event === 'PASSWORD_RECOVERY') {
      //   // handle password recovery event
      // } else if (event === 'TOKEN_REFRESHED') {
      //   // handle token refreshed event
      // } else if (event === 'USER_UPDATED') {
      //   // handle user updated event
      // }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const createAccount = async ({
    email,
    password,
    mobileNumber,
    username,
  }: SignupFormData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          mobileNumber,
        },
      },
    });

    if (error) {
      throw error;
    } else {
      setSession(data.session);
    }
    return !error;
  };

  const login = async ({ email, password }: LoginFormData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    } else {
      setSession(data.session);
    }
    return !error;
  };

  return (
    <UserContext.Provider
      value={{
        session,
        createAccount,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
