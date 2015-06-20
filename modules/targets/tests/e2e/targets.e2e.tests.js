'use strict';

describe('Targets E2E Tests:', function() {
	describe('Test Targets page', function() {
		it('Should not include new Targets', function() {
			browser.get('http://localhost:3000/#!/targets');
			expect(element.all(by.repeater('target in targets')).count()).toEqual(0);
		});
	});
});
