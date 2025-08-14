import { useAuth } from '@client/provider/authProvider';
import { ReactNode } from 'react';

type HasRolesProps = {
  roles: string | string[];
  children: ReactNode | ReactNode[];
};

const HasRoles = ({ roles, children }: HasRolesProps) => {

  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  const { user: authUser } = useAuth();
  if (!authUser) {
    return null;
  }

  const userRoles = authUser.roles;
  if (!requiredRoles.some((role) => userRoles.includes(role))) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
};

export default HasRoles;