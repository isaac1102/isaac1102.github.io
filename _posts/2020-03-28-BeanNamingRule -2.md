---
layout: post
title:  "빈 이름 별칭 짓기(전문가를 위한 스프링 5)"
date:   2020-03-28 00:00:07
categories: SPRING
tags: IOC DI SPRING
---

* content
{:toc}

## 2. 빈 이름 별칭 짓기
- 빈에 여러 이름을 지정하려면 빈의 <bean>태그의 name 애트리뷰트에 공백, 쉼표, 세미콜론 등으로 구분해 이름의 목적을 지정하면 된다. 
- name 애트리뷰트를 사용하는 것 외에도 name들에 대한 별칭을 정의할 때 <alias> 태그를 사용할 수 있다. 

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="john" name="john johnny, jonathan;jim"  class="java.lang.String"/>
	<alias name="john" alias="ion"/>
</beans>
```
app-context-02.xml

```
package com.ch3.xml;

import java.util.Map;

import org.springframework.context.support.GenericXmlApplicationContext;

public class BeanNamingAliasing {
	public static void main(String[] args) {

		GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
		ctx.load("classpath:spring/app-context-02.xml");
		ctx.refresh();

		String s1 = (String) ctx.getBean("john");
		String s2 = (String) ctx.getBean("jon");
		String s3 = (String) ctx.getBean("johnny");
		String s4 = (String) ctx.getBean("jonathan");
		String s5 = (String) ctx.getBean("jim");
		String s6 = (String) ctx.getBean("ion");

		System.out.println(s1 == s2);
		System.out.println(s2 == s3);
		System.out.println(s3 == s4);
		System.out.println(s4 == s5);
		System.out.println(s5 == s6);

		Map<String, String> beans =  ctx.getBeansOfType(String.class);

		if(beans.size() == 1) {
			System.out.println("오직 하나의 String 빈만 존재함");
		}

		ctx.close();
	}
}
```
앞의 코드를 실행하면 true가 다섯 번 출력되고 "오직 하나의 String 빈만 존재함"이라는 문구를 출력하는데, 
이를 통해서 다른 이름을 사용해 접근한 빈이 실제로 동일한 빈인지 확인할 수 있다. 



### name과 id attribute는 IoC에 의해 다르게 다뤄진다.

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean name="jon johnny,jonathan;jim" class="java.lang.String"/>
	<bean id="jon johnny,jonathan;jim" class="java.lang.String"/>
</beans>
```
app-context-03.xml

위의 예제에서, ApplicationContext.getAliases(String)를 호출하고 빈의 이름이나 ID 중 하나를 전달해 빈의 별칭 목록을 검색 할 수 있다. 
그 결과 지정한 별칭을 제외한 나머지 별칭 목록이 문자열 배열로 반환된다. 
- 첫번째 경우엔 jon이 Id가 되고 나머 값은 별칭이 된다. 
- 두번째 빈의 경우 문자열이 id 애트리뷰트 값으로 사용될 때 전체 문자열은 빈에 대한 고유한 식별자가 된다. 


```
package com.ch3.xml;

import java.util.Arrays;
import java.util.Map;

import org.springframework.context.support.GenericXmlApplicationContext;

public class BeanCrazyNaming {
	public static void main(String[] args) {

		GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
		ctx.load("classpath:spring/app-context-03.xml");
		ctx.refresh();

		//String 타입의 모든 빈을 얻는다.
		Map<String, String> beans = ctx.getBeansOfType(String.class);

		beans.entrySet().stream().forEach(b->{
			System.out.println("id: " + b.getKey() + "\n 별칭: " + Arrays.toString(ctx.getAliases(b.getKey() + "\n")));
		});


		ctx.close();
	}
}
```
BeanCrazyNaming.java
