import { MenuItem } from "@mui/material";
import type { ReactNode } from "react";
import { NavLink } from "react-router";

export default function MenuItemLink({children, to}:{children: ReactNode, to: string}) {    //inline prop scpecification
  return (
    <MenuItem 
        component={NavLink} 
        to={to} 
        sx={{
            fontSize: '1.2rem', 
            textTransform: 'uppercase', 
            fontWeight: 'bold', 
            color: 'inhredit',
            '&.active': {
                color: 'yellow'
            }}}
    >
        {children}
    </MenuItem>
  )
}