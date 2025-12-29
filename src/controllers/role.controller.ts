import {
  Controller,
  Get,
  Post,
  Put,
  Route,
  Tags,
  Body,
  Path,
  SuccessResponse,
  Security,
  Middlewares,
  Response,
} from 'tsoa';
import { createRoleBodyValidator, updateRoleBodyValidator } from '../middlewares';
import { roleService } from '../services';
import { Responses } from '../models/responses.model';
import { TCreateRoleRequestBody, TUpdateRoleRequestBody } from '../models/requests.model';
import { NotFoundError, ConflictError, ErrorWithStatus } from '../models/errors.model';
import { HTTP_STATUS } from '@constants/http';
import { TCreateRoleData, TRole } from '../models/schemas';

@Route('roles')
@Tags('Roles')
@Security('jwt')
@Response<ErrorWithStatus>(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized')
export class RoleController extends Controller {
  /**
   * Get all available user roles
   */
  @Get('/')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  public async getAllRoles() {
    const roles = await roleService.getRoles();
    return Responses.success('Roles retrieved successfully', roles);
  }

  /**
   * Get a specific role by ID
   */
  @Get('{id}')
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Role not found')
  public async getRole(@Path() id: number) {
    const role = await roleService.getRole(id);

    if (!role) {
      throw new NotFoundError('Role not found');
    }

    return Responses.success('Role retrieved successfully', role);
  }

  /**
   * Create a new user role
   */
  @Post('/')
  @Middlewares(createRoleBodyValidator)
  @SuccessResponse(HTTP_STATUS.CREATED, 'Created')
  @Response<ErrorWithStatus>(HTTP_STATUS.CONFLICT, 'Role with this name already exists')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  public async createRole(@Body() requestBody: TCreateRoleRequestBody) {
    const { name, description, code } = requestBody;

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

    this.setStatus(201);
    return Responses.success('Role created successfully', newRole);
  }

  /**
   * Update an existing role's details
   */
  @Put('{id}')
  @Middlewares(updateRoleBodyValidator)
  @SuccessResponse(HTTP_STATUS.OK, 'Success')
  @Response<ErrorWithStatus>(HTTP_STATUS.NOT_FOUND, 'Role not found')
  @Response<ErrorWithStatus>(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed')
  public async updateRole(@Path() id: number, @Body() requestBody: TUpdateRoleRequestBody) {
    const { name, description } = requestBody;
    const updatedRows = await roleService.updateRole(id, { name, description });

    if (updatedRows === 0) {
      throw new NotFoundError('Role not found');
    }

    const updatedRole = await roleService.getRole(id);

    return Responses.success('Role updated successfully', updatedRole);
  }
}
