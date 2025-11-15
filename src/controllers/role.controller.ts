import { Request, Response } from 'express';
import { roleService, userService } from '@services';
import { CreateRoleData, UpdateRoleData } from '@models/schemas';
import { ConflictError, InternalServerError, NotFoundError, Responses } from '@models';

export const getAllRoles = async (req: Request, res: Response): Promise<Response> => {
  try {
    const roles = await roleService.getRoles();
    return Responses.success(res, 'Roles retrieved successfully', roles);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to fetch roles');
  }
};

export const getRole = async (req: Request, res: Response): Promise<Response> => {
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

export const createRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, description, code } = req.body;

    const existingRole = await roleService.getRoleByName(name);
    if (existingRole) {
      throw new ConflictError('Role with this name already exists');
    }

    const roleData: CreateRoleData = {
      name,
      code,
      description: description,
    };

    const [roleId] = await roleService.createRole(roleData);
    const newRole = await roleService.getRole(roleId);

    return Responses.created(res, 'Role created successfully', newRole);
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to create role');
  }
};

export const updateRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updateData: UpdateRoleData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (name) {
      const existingRole = await roleService.getRoleByName(name);
      if (existingRole && existingRole.id !== Number(id)) {
        throw new ConflictError('Role with this name already exists');
      }
    }

    const updatedRows = await roleService.updateRole(Number(id), updateData);

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

export const deleteRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // Check if role has users assigned
    const usersWithRole = await roleService.getUsersWithRole(Number(id));
    if (usersWithRole.length > 0) {
      throw new ConflictError('Cannot delete role assigned to users');
    }

    const deletedRows = await roleService.deleteRole(Number(id));

    if (deletedRows === 0) {
      throw new NotFoundError('Role not found');
    }

    return Responses.success(res, 'Role deleted successfully');
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to delete role');
  }
};

export const assignUserRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, roleId } = req.body;

    const role = await roleService.getRole(roleId);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    const hasRole = await userService.hasRole(userId, roleId);
    if (hasRole) {
      throw new ConflictError('User already has this role');
    }

    await userService.assignRole(userId, roleId);

    return Responses.success(res, 'Role assigned successfully');
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to assign role');
  }
};

export const removeUserRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, roleId } = req.body;

    const removedRows = await userService.removeRole(userId, roleId);

    if (removedRows === 0) {
      throw new NotFoundError('User role assignment not found');
    }

    return Responses.success(res, 'Role removed successfully');
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to remove role');
  }
};
