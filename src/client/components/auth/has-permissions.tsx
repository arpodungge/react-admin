import { useAuth } from '@client/provider/authProvider';
import { ReactNode } from 'react';

type HasPermissionsProps = {
  permissions: string | string[];
  children: ReactNode | ReactNode[];
};

const HasPermissions = ({ permissions: permissions, children }: HasPermissionsProps) => {

  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

  const { user: authUser } = useAuth();
  if (!authUser) {
    return null;
  }

  const userPermissions = authUser.permissions;
  if (!requiredPermissions.some((role) => userPermissions.includes(role))) {
    return null;
  }
  return (
    <>
      {children}
    </>
  );
};

export default HasPermissions;