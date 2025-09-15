// lambda-functions/api-token-authorizer/index.mjs (최종 완성본)
import jwt from 'jsonwebtoken';

// API Gateway에 반환할 정책 문서를 생성하는 헬퍼 함수
const generatePolicy = (principalId, effect, resource, context) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }],
        };
        authResponse.policyDocument = policyDocument;
    }
    if (context) {
        authResponse.context = context;
    }
    return authResponse;
};

export const handler = async (event) => {
    try {
        const tokenHeader = event.authorizationToken || '';
        const token = tokenHeader.split(' ')[1];

        if (!token) {
            return generatePolicy('user', 'Deny', event.methodArn);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ★★★ 수정된 부분: event.routeArn -> event.methodArn ★★★
        return generatePolicy(decoded.id, 'Allow', event.methodArn, {
            userId: decoded.id,
            email: decoded.email,
            name: decoded.name
        });

    } catch (error) {
        console.error("JWT Verification Error in Authorizer:", error);
        return generatePolicy('user', 'Deny', event.methodArn);
    }
};