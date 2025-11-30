import { Request, Response } from 'express';
import { roleService, userService } from '@services';
import { TCreateRoleData, TUpdateRoleData } from '@models/schemas';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  Responses,
  TGetRoleRequestParams,
  TCreateRoleRequestBody,
  TUpdateRoleRequestParams,
  TUpdateRoleRequestBody,
} from '@models';

export const getAllRoles = async (req: Request, res: Response): Promise<Response> => {
  try {
    const roles = await roleService.getRoles();
    return Responses.success(res, 'Roles retrieved successfully', roles);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch roles');
  }
};

export const getRole = async (req: Request<TGetRoleRequestParams>, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const role = await roleService.getRole(Number(id));

    if (!role) {
      throw new NotFoundError('Role not found');
    }

    return Responses.success(res, 'Role retrieved successfully', role);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch role');
  }
};

export const createRole = async (req: Request<any, any, TCreateRoleRequestBody>, res: Response): Promise<Response> => {
  try {
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
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to create role');
  }
};

export const updateRole = async (
  req: Request<TUpdateRoleRequestParams, any, TUpdateRoleRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedRows = await roleService.updateRole(Number(id), { name, description });

    if (updatedRows === 0) {
      throw new NotFoundError('Role not found');
    }

    const updatedRole = await roleService.getRole(Number(id));

    return Responses.success(res, 'Role updated successfully', updatedRole);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to update role');
  }
};
