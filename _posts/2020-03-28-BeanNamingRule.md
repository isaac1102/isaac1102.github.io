---
layout: post
title:  "빈 명명 규칙(전문가를 위한 스프링 5)"
date:   2020-03-28 00:00:07
categories: SPRING
tags: IOC DI SPRING
---

* content
{:toc}

### 1. 모든 빈은 ApplicationContext안에서 고유한 하나 이상의 이름을 가지는 게 좋다.
- <bean>태그에 id 애트리뷰트의 값을 지정하면 이 값이 이름으로 사용된다.
- id가 없다면 name 애트리뷰트를 찾으며, 그 중 첫번째 이름을 사용한다. 
- id와 name 애트리뷰트가 모두 없다면 스프링은 빈의 클래스 이름을 빈 이름으로 사용한다. 
- id와 name이 없는데 동일한 타입의 빈이 여러개 선언 돼 있다면 스프링은 ApplicationContext 초기화 과정에서 해당 타입의 빈을 주입할 때 예외를 던진다.(org.springframework.beans.factory.NoSuchBeanDefinitionException)

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="string1" class="java.lang.String"/>
	<bean id="string2" class="java.lang.String"/>
	<bean class="java.lang.String"/>
	<bean class="java.lang.String"/>
</beans>
```
app-context-01.xml

```
package com.ch3.xml;

import java.util.Map;

import org.springframework.context.support.GenericXmlApplicationContext;

public class BeanNamingTest {
	public static void main(String[] args) {

		GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
		ctx.load("classpath:spring/app-context-01.xml");
		ctx.refresh();

		//String 타입의 모든 빈을 얻는다.
		Map<String, String> beans = ctx.getBeansOfType(String.class);

		beans.entrySet().stream().forEach(b-> System.out.println(b.getKey()));

		ctx.close();
	}
}
```
BeanNamingTest.java



결과값
>string1<br>
string2<br>
java.lang.String#0<br>
java.lang.String#1
