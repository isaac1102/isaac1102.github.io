---
layout: post
title:  "FactoryBean 사용법"
date:   2020-04-03 00:00:07
categories: SPRING
tags: FactoryBean SPRING
---

* content
{:toc}


## FactoryBean

> FactoryBean은 다른 빈을 생성하는 팩터리 역할의 빈이다.

특별히 FactoryBean은 여타 스프링 빈과는 달리 ApplicationContext에서 구성은 하지만 인스턴스 	반환 방식이 다르다. 
 - FactoryBean.getObject()메서드를 호출하여 반환받는다. 
 
### 예제1-MessageDigesterFactoryBean(4.6.1)

MessageDigest 자체는 추상 클래스이기 때문에 사용하고자 할 때, MessageDigest.getInstance()메서드를 호출해서 사용하고자 하는 해시 알고리즘 이름을 인수로 전달해 원하는 구현체 인스턴스를 얻는 방식이다.
```
MessageDigest md5 = MessageDigest.getInstance("MD5");
```

FactoryBean을 사용하지 않는다면, 초기화 콜백에 주입하고 algorithmName 프로퍼티를 사용해서 호출하면 된다. 

하지만 FacotryBean으로 빈 내부에 캡슐화할 수 있다. 	


```
package com.ch4.factoryBean;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;

public class MessageDigestFactoryBean implements FactoryBean<MessageDigest>, InitializingBean{

	private String algorithmName = "MD5";

	private MessageDigest messageDigest = null;

	public MessageDigest getObject() throws Exception{
		return messageDigest;
	}

	public Class<MessageDigest> getObjectType(){
		return MessageDigest.class;
	}

	public boolean isSingleton() {
		return true;
	}

	public void afterPropertiesSet() throws NoSuchAlgorithmException {
		messageDigest = MessageDigest.getInstance(algorithmName);
	}

	public void setAlgorithmName(String algorithmName) {
		this.algorithmName = algorithmName;
	}
}
```

1) InitializingBean.afterPropertiesSet() 콜백으로 MessageDigest인스턴스를 가지고 있다가,

2) getObject()를 통해서 넘겨준다. <br>
- getObject메서드는 새로만든 FactoryBean이 사전에 반환타입을 알 수 없을 때사용한다. 
- 다만, 타입을 지정하면 스프링이 FactoryBean 인스턴스를 Autowiring할 수 있다. (앞 예제에선 MessageDigest타입을 반환함)




다음 소스는 이 인스턴스의 digest()메서드로 전달받은 메시지의 해시 값을 출력하는 간단한 코드이다. 

```
package com.ch4.factoryBean;

import java.security.MessageDigest;

public class MessageDigester {
	private MessageDigest digest1;
	private MessageDigest digest2;

	public void setDigest1(MessageDigest digest1) {
		this.digest1 = digest1;
	}

	public void setDigest2(MessageDigest digest2) {
		this.digest2 = digest2;
	}

	public void digest(String msg) {
		System.out.println("digest1 사용");
		digest(msg, digest1);
		System.out.println("digest2 사용");
		digest(msg, digest2);
	}

	private void digest(String msg, MessageDigest digest) {
		System.out.println("사용하는 알고리즘:  " + digest.getAlgorithm());
		digest.reset();
		byte[] bytes = msg.getBytes();
		byte[] out = digest.digest(bytes);
		System.out.println(out);
	}
}
```

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="shaDigest" class="com.ch4.factoryBean.MessageDigestFactoryBean"
    	p:algorithmName="SHA1"/>

    <!-- 프로퍼티 설정을 따로 하지 않기 때문에 클래스의 기본 필드값을 사용한다.(MD5) -->
    <bean id="defaultDigest" class="com.ch4.factoryBean.MessageDigestFactoryBean"/>

    <bean id="digester"
          class="com.ch4.factoryBean.MessageDigester"
          p:digest1-ref="shaDigest"
          p:digest2-ref="defaultDigest"
    />
 </beans>
 ```
 - 서로 다른 빈을 정의하는 구성 예시로, 하나는 SHA1알고리즘을 사용하고 다른 하나는 기본(MD5) 알고리즘을 사용한다. 
 
 
 다음은 BeanFactory에서 MessageDigester 빈을 받아 간단한 메시지 해시 값을 생성하는 예제이다. 
 
 
 ```
 package com.ch4.factoryBean;

import org.springframework.context.support.GenericXmlApplicationContext;

public class MessageDigestDemo {
	public static void main(String[] args) {
		GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
		ctx.load("classpath:spring/app-context-factoryBean.xml");
		ctx.refresh();

		MessageDigester digester = ctx.getBean("digester", MessageDigester.class);
		digester.digest("Hello World");

		ctx.close();
	}
}
```

 