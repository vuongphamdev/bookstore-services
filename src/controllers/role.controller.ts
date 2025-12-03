import { Request, Response } from 'express';
import { roleService } from '@services';
import { TCreateRoleData } from '@models/schemas';
import {
  ConflictError,
  NotFoundError,
  Responses,
  TGetRoleRequestParams,
  TCreateRoleRequestBody,
  TUpdateRoleRequestParams,
  TUpdateRoleRequestBody,
} from '@models';

export const getAllRoles = async (req: Request, res: Response): Promise<Response> => {
  const roles = await roleService.getRoles();
  return Responses.success(res, 'Roles retrieved successfully', roles);
};

export const getRole = async (req: Request<TGetRoleRequestParams>, res: Response): Promise<Response> => {
  const { id } = req.params;

  const role = await roleService.getRole(Number(id));

  if (!role) {
    throw new NotFoundError('Role not found');
  }

  return Responses.success(res, 'Role retrieved successfully', role);
};

export const createRole = async (req: Request<any, any, TCreateRoleRequestBody>, res: Response): Promise<Response> => {
  const { name, description, code } = req.body;

  const existingRole = await roleService.getRoleByName(name);
  if (existingRole) {
    throw new ConflictError('Role with this name already exists');
  }

  const roleData: TCreateRoleData = {
    name,
    code,
    description: description,
  };

  const roleId = await roleService.createRole(roleData);
  const newRole = await roleService.getRole(roleId);

  return Responses.created(res, 'Role created successfully', newRole);
};

export const updateRole = async (
  req: Request<TUpdateRoleRequestParams, any, TUpdateRoleRequestBody>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { name, description } = req.body;
  const updatedRows = await roleService.updateRole(Number(id), { name, description });

  if (updatedRows === 0) {
    throw new NotFoundError('Role not found');
  }

  const updatedRole = await roleService.getRole(Number(id));

  return Responses.success(res, 'Role updated successfully', updatedRole);
};
