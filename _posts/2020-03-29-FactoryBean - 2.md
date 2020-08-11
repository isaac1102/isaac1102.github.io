---
layout: post
title:  "FactoryBean 사용법(계속)"
date:   2020-04-03 00:00:07
categories: SPRING
tags: FactoryBean SPRING
---

* content
{:toc}


## FactoryBean에 직접 접근하기(4.6.2)
> FactoryBean에 바로 접근하는 방법은 빈 이름 앞에 &문자를 붙여 getBean() 메서드를 호출하는 것이다.

```
package com.ch4.factoryBean_462;

import java.security.MessageDigest;

import org.springframework.context.support.GenericXmlApplicationContext;

import com.ch4.factoryBean_461.MessageDigestFactoryBean;

public class AccessingFactoryBeans {
	public static void main(String[] args) {
		GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
		ctx.load("classpath:spring/app-context-factoryBean.xml");
		ctx.refresh();
		ctx.getBean("shaDigest", MessageDigest.class);

		MessageDigestFactoryBean factoryBean = (MessageDigestFactoryBean) ctx.getBean("&shaDigest");

		try {
			MessageDigest shaDigest = factoryBean.getObject();
			System.out.println(shaDigest.digest("Hello World".getBytes()));
		}catch(Exception ex){
			ex.printStackTrace();
		}

		ctx.close();
	}
}
```

결과값

> B37374a5e



하지만 웬만하면 이런 방식은 안하는 게 좋다. <br>
스프링에게 그냥 맡겨라.<br>
괜히 직접 접근해서 getObject방식으로 호출할 필요 없다. 



## factory-bean과 factory-method 애트리뷰트 사용하기(4.6.3)

때로는 서드파티 애플리케이션이 제공하는 자바빈 인스턴스를 생성해야 할 때가 있다. 
자세히 몰라도 이 애플리케이션 클래스가 스프링 애플리케이션이 필요로 하는 인스턴스를 제공하는 것만 알고 있을 때, 
< bean > 태그에 스프링 빈의 factory-bean과 factory-method애트리뷰트를 사용할 수 있다. 

```
package com.ch4.factoryBean_463;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MessageDigestFactory {
	private String algorithmName = "MD5";

	public MessageDigest createInstance() throws NoSuchAlgorithmException {
		return MessageDigest.getInstance(algorithmName);
	}

	public String getAlgorithmName() {
		return algorithmName;
	}

	public void setAlgorithmName(String algorithmName) {
		this.algorithmName = algorithmName;
	}
}
```
MessageDigestFactory.java



```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="shaDigestFactory" class="com.ch4.factoryBean_463.MessageDigestFactory"
    	p:algorithmName="SHA1"/>

	<!-- 프로퍼티 설정을 따로 하지 않기 때문에 클래스의 기본 필드값을 사용한다.(MD5) -->
   	<bean id="defaultDigestFactory" class="com.ch4.factoryBean_463.MessageDigestFactory"/>

	<bean id="shaDigest"
		  factory-bean="shaDigestFactory"
		  factory-method="createInstance"
	/>

	<bean id="defaultDigest"
		  factory-bean="defaultDigestFactory"
		  factory-method="createInstance"
	/>

   	<bean id="digester"
   		class="com.ch4.factoryBean_461.MessageDigester"
   		p:digest1-ref="shaDigest"
   		p:digest2-ref="defaultDigest"
   		/>
 </beans>
```
app-context-factoryBean463.xml



```
package com.ch4.factoryBean_463;

import org.springframework.context.support.GenericXmlApplicationContext;

import com.ch4.factoryBean_461.MessageDigester;

public class MessageDigestFactoryDemo {
	public static void main(String[] args) {
		GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
		ctx.load("classpath:spring/app-context-factoryBean463.xml");
		ctx.refresh();

		MessageDigester digester = (MessageDigester) ctx.getBean("digester");
		digester.digest("Hello World!");

		ctx.close();
	}
}
``` 
MessageDigestFactoryDemo.java