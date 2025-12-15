import { globalFiler } from '../common/execption_filter';
import { BadRequestException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { error, timeStamp } from 'node:console';
import { url } from 'node:inspector';
import { json } from 'node:stream/consumers';

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

    const filter = new globalFiler();
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
