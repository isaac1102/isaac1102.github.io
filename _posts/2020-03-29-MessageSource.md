---
layout: post
title:  "MessageSource 사용"
date:   2020-04-04 00:00:07
categories: SPRING
tags: MessageSource SPRING
---

* content
{:toc}

# MessageSource를 사용한 국제화 (4.8.1.1)
- 스프링의 뛰어난 점 중 하나는 국제화 지원(i18n)이다. 
- MessageSource 인터페이스를 사용하면 애플리케이션에서 메시지라 불리는 다양한 언어로 저장된 String 리소스에 접근할 수 있다.
- MessageSource 사용을 위해 ApplicationContext를 사용할 필요는 없다. ApplicationContext를 인터페이스가 MessageSource를 상속해 메시지를 읽어들이고 애플리케이션 환경에서 읽어들인 메시지에 자동으로 접근하는 특수 기능을 제공하기 때문이다. 

```
package com.ch4.messageSource;

import java.util.Locale;

import org.springframework.context.support.GenericXmlApplicationContext;

public class MessageSourceDemo {
	public static void main(String[] args) {
		GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
		ctx.load("classpath:spring/app-context-messageSource.xml");
		ctx.refresh();

		Locale english = Locale.ENGLISH;
		Locale korean = new Locale("ko", "KR");

		System.out.println(ctx.getMessage("msg", null, english));
		System.out.println(ctx.getMessage("msg", null, korean));

		System.out.println(ctx.getMessage("nameMsg", new Object[]{"john", "mayer"}, english));
		System.out.println(ctx.getMessage("nameMsg", new Object[]{"john", "mayer"}, korean));

		ctx.close();
	}
}
```
이 소스에서는 메서드가 키에 해당하는 메시지를 지정된 로케일에 맞춰 가져온다는 점만 알면 된다.
getMessage메서드를 통해 메시지를 가져오는 것은 잠시 뒤에 설명하겠다.

```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:util="http://www.springframework.org/schema/util"
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/util
        http://www.springframework.org/schema/util/spring-util.xsd">

 	<bean id="messageSource" class="org.springframework.context.support.ResourceBundleMessageSource"
 		p:basenames-ref="basenames"/>

 	<util:list id="basenames">
 		<value>buttons</value>
 		<value>labels</value>
 	</util:list>
</beans>
```



## getMessage()메서드 (4.8.1.2)

![](/../img/getMessage.jpg)

## ApplicationContext를 MessageSource로 사용하는 이유(4.8.1.3)

어째서 getMessage()를 함에 있어서 ResourceBundleMessageSource 빈에 직접 접근하지 않고 ApplicationContext.getMessage()를 사용했을까?

### 1. ApplicationContext를 통한 접근은 불필요한 프로퍼티 노출을 줄여준다. 
- 스프링 MVC 프레임워크를 사용해 웹 어플리케이션을 만들 때만 메시지를 가져오는 데 ApplicationContext를 사용해야 한다. 
	- 왜냐하면 불필요하게 MessageSource와 ApplicationContext를 결합시키기기 때문이다.
- 스프링 MVC의 핵심은 Controller다. 스프링은 개발자가 컨트롤러 구현에 사용할 수 있는 유용한 기반 클래스 모음을 제공하는데, 이 클래스들은 ApplicationObjectSupport클래스의 자식 클래스다. 
- ApplicationObjectSupport 클래스는 ApplicationContext를 사용하려는 모든 어플리케이션 객체에게 ApplicationContext 접근을 가능하게 해준다. 
- (웹 어플리케이션 설정에서는 ApplicationContext가 자동 실행된다.)

ApplicationObjectSupport클래스 내부에서 ApplicationContext에 접근 및 ApplicationContext를 MessageSourceAccessor 객체로 감싸주는 역할을 한다. (이렇게 하면 웹 어플리케이션 컨트롤러가 protected로 선언된 getMessageSourceAccessor() 메서드를 사용해 ApplicationObjectSupport 내부의 MessageSourceAccessor에 접근할 수 있다. )
MessageSourceAccessor는 MessageSource 인스턴스를 사용할 수 있도록 다양한 메서드를 제공한다.

-> 이런 유형의 자동 주입은 모든 컨트롤러에 MessageSource 프로퍼티를 노출할 필요가 없도록 해준다. 

### 2. 뷰 레이어에서도 ApplicationContext를 가능한 한 MessageSource로 노출하기 때문이다. 
하지만 무엇보다 이 방법을 사용하는 가장 큰 장점이자 이유는, 
뷰 레이어에서도 ApplicationContext를 가능한 한 MessageSource로 노출하기 때문이다. 
예) JSP 태그 라이브러리 사용 시, <spring:message>태그를 사용하면 자동으로 applicationContext메시지를 읽는 것과 같다. <fmt:message>도 마찬가지.

위와 같은 장점들 때문에 MessageSource 인스턴스를 따로 관리하기보다 ApplicationContext를 통해 제공받은 MessageSource를 사용한다.
