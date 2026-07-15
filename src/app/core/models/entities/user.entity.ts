
import { singleStoreFactory } from "@core/config/single-store";

export interface User_m {
    nip: string;
    peopleId?: any;
    peopleName?: string;
    roleName?: string;
    position?: string;
    imageProfile?: string;
    isCulture?: boolean;
    isInovation?: boolean
    branch?: string;
    role?: Role_m[];
    roleId?: number;
    groupId?: number;
    roleCode?: string;
    apps: apps[];
}

export interface apps {
    appId?: string;
    show?: boolean;
    active?: boolean;
    count_notif?: number;
}

export interface Role_m {
    id?: number;
    people_id?: number;
    branch?: string;
    primary_role_id?: string;
    position_name?: string;
    role_atasan?: string;
    group_id?: number;
    is_active?: string;
    start_date?: string;
    end_date?: string;
    parent_id?: number;
}



export const Entity_User = singleStoreFactory<User_m>();
