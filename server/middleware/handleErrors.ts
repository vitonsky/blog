import { Request, Response } from 'express';

export const errorHandlerMiddleware = (
	error: any,
	request: Request,
	response: Response,
	_next: any,
) => {
	console.error(error);

	response.status(500);

	const message = 'Bad request';
	const isJson = request.is('application/json');
	if (isJson) {
		response.json({ error: message });
	} else {
		response.send(message);
	}
};
