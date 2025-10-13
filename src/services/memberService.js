import userRepository from '../repositories/userRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import { isUserMemberOfWorspace } from './workspaceService.js';

export const isMemberPartOfWorkspaceService = async (workspaceId, memberId) => {
  const workspace = await workspaceRepository.getById(workspaceId);
  if (!workspace) {
    throw new ClientError({
      explaination: 'Invalid data sent from the client',
      message: 'Workspace not found',
      StatusCode: StatusCodes.NOT_FOUND
    });
  }
  const isUserAMember = isUserMemberOfWorspace(workspace, memberId);

  if (!isUserAMember) {
    throw new ClientError({
      explaination: 'User is not a member of the workspace',
      message: 'User is not a member of the workspace',
      StatusCode: StatusCodes.UNAUTHORIZED
    });
  }

  const user = await userRepository.getById(memberId);
  return user;
};
