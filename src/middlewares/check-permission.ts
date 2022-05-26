import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions';
import { getTokenType } from '../resources/token';
import { Route, services } from '../routes';

type ServiceName = typeof services[number];
const checkPermission = (service: ServiceName, route: Route) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!route.needAuth) return next(); // 인증이 필요없는 라우트일 경우 프리패스
    const userToken = req.token;

    // 인증이 필요한 라우트에 접근하는데 토큰이 없는 경우
    if (!userToken) {
      throw new HttpException(401, '액세스 토큰이 Authorization 헤더에 Bearer Token Type으로 전송되어야 합니다.');
    }

    // 인증이 필요한 라우트에 접근하는데 액세스 토큰이 아닌 경우
    const tokenType = await getTokenType(userToken);
    if (tokenType !== 'ACCESS') {
      throw new HttpException(401, '액세스 토큰이 아닙니다.');
    }

    // 모든 검사 통과
    return next();
  };

export default checkPermission;