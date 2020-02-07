const webdriver = require('selenium-webdriver');


async function basicTest(){
	let driver, testElement, elementValue; 
	try{
		driver = new webdriver.Builder()
		.forBrowser('chrome')
		.build();

		await driver.get('http://localhost:3000');

		await driver.getTitle().then(function(title){
			console.log(`The title is: ${title}`)
		});
		testElement = await (driver.findElement(webdriver.By.id('dateLabel')));
		elementValue = await testElement.getText();
		console.log(elementValue);
	        setTimeout(function(){driver.quit()}, 100);
	}
	catch(err){
		console.log("error", err.stack);
		driver.quit();
	}
}

basicTest();
//		.catch(err => console.log(err)))
		

