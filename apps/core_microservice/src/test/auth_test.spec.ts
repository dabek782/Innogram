import { BadRequestException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { GlobalFiler } from '../common/execption_filter';

describe('globalFiter', () => {
  it('Formats badrequest', () => {
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn();
    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => ({ status: statusMock, json: jsonMock }),
        getRequest: () => ({ url: '/test' }),
      }),
    } as unknown as ArgumentsHost;

    const filter = new GlobalFiler();
    filter.catch(new BadRequestException('bad'), mockHost);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: { error: 'Bad Request', message: 'bad', statusCode: 400 },
        statusCode: 400,
      })
    );
  });
});
