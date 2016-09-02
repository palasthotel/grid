import AmpersandModel from 'ampersand-model';

moduel.exports = AmpersandModel.extend({
	props: {
		firstName: 'string',
		lastName: 'string'
	},
	session: {
		signedIn: ['boolean', true, false],
	},
	derived: {
		fullName: {
			deps: ['firstName', 'lastName'],
			fn: function () {
				return this.firstName + ' ' + this.lastName;
			}
		}
	}
});