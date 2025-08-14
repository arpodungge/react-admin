import { useAuth } from '@client/provider/authProvider';
import React, { ReactNode } from 'react'

type AuthorizedProps = {
  roles?: string | string[] | undefined;
  permissions?: string | string[] | undefined;
  children: ReactNode | ReactNode[];
};

const Authorized  = ({ roles, permissions, children }: AuthorizedProps) => {
  const {user:authUser} = useAuth();

  if (!authUser) {
    return null;
  }

  const userRoles = authUser?.roles || [];
  const userPermissions = authUser?.permissions || [];

  // If neither roles nor permissions are provided, render children
  if (!roles && !permissions) {
    return <>{children}</>;
  }

  // If only roles are provided, check if the user has at least one of them
  if (roles && !permissions) {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    let hasRequiredRoles = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRequiredRoles) {
      return null;
    }
  }

  // If only permissions are provided, check if the user has at least one of them
  if (permissions && !roles) {
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    let hasRequiredPermissions = requiredPermissions.some(permission => userPermissions.includes(permission));
    if (!hasRequiredPermissions) {
      return null;
    }
  }

  // If both roles and permissions are provided, check if the user has at least one of them
  if (roles && permissions) {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

    let hasRequiredRoles = requiredRoles.some(role => userRoles.includes(role));
    let hasRequiredPermissions = requiredPermissions.some(permission => userPermissions.includes(permission));

    if (!hasRequiredRoles && !hasRequiredPermissions) {
      return null;
    }
  }
  
  // If we reach here, it means the user has either the required roles or permissions
  // or both, so we render the children.
  return <>{children}</>;
}

export default Authorized
