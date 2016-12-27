import HandlerBase from './_handler.base.js';

import {Events} from '../../../constants';

export default class GridPermissions extends HandlerBase{
	
	Rights(response){
		this._events.emit(Events.PERMISSIONS, response.data);
		this._setState({permissions:response.data});
	}
	
}