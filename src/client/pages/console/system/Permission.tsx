import Authorized from '@client/components/auth/authorized';
import HasPermissions from '@client/components/auth/has-permissions';
import HasRoles from '@client/components/auth/has-roles';
import axios from 'axios';
import React, { useEffect } from 'react'

const Permission = () => {
  
  useEffect(() => {
    axios.get("/api/system/permission").then((res) => {
      console.log(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Permission</h1>
    </div>
  )
}

export default Permission