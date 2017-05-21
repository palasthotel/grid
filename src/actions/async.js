
/**
 *
 * @param {function} request
 * @param {function} before
 * @param {function} then
 * @return {function(*=)}
 */
export function actionAsyncExecute( {request = ()=>{}, before =(dispatch) => {}, then = (result)=>{} } ){
	return (dispatch)=>{
		before(dispatch);
		return request().then(then.bind(this,dispatch));
	}
}