---
layout: post
title:  "의존성 해석하기(전문가를 위한 스프링 5)"
date:   2020-03-28 00:00:07
categories: SPRING
tags: IOC DI SPRING
---

* content
{:toc}

## xml 방식의 의존성 해석

```
package com.ch3.dependency;

import org.springframework.context.support.GenericXmlApplicationContext;

public class DependsDemo {
	public static void main(String[] args) {
		GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
		ctx.load("classpath:spring/app-context-04.xml");
		ctx.refresh();

		Singer johnMayer =  ctx.getBean("johnMayer", Singer.class);
		johnMayer.sing();

		ctx.close();
	}
}

```
DependsDemo.java

- ApplicationContext에서 johnMayer빈을 생성하고, johnMayer.sing()메서드를 실행하는 코드이다. 
- johnMayer빈의 sing()을 보면, Guitar타입의 의존성에 의존한다는 것을 알 수 있다.
<br>
<br>

```
package com.ch3.dependency;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class Singer implements ApplicationContextAware{

	ApplicationContext ctx;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.ctx = applicationContext;
	}

	private Guitar guitar;

	public Singer() {

	}

	public void sing() {
		
		guitar = ctx.getBean("gopher", Guitar.class);
		guitar.sing();
	}
}
```

- sing메서드에서 gopher빈을 가져오기 위해서는 ApplicationContext에 접근해야 하는데, ApplicationContext 의존성을 주입받기 위해서는 ApplicationContextAware 인터페이스를 통해서 ApplicationContext를 가져오는 수정자를 구현해야 한다. 
- johnMayer빈은 자신의 메서드인 johnMayer.sing()메서드가 호출될 때, ctxBean() 메서드를 호출해 Guitar 타입의 다른 빈 인스턴스인 gopher를 얻는다.
- 그리고 의존성 관계는 아래 xml파일을 통해서 정의된다.


```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:c="http://www.springframework.org/schema/c"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="johnMayer" class="com.ch3.dependency.Singer" depends-on="gopher"/>
	<bean id="gopher" class="com.ch3.dependency.Guitar"/>
</beans>
```
app-context-04.xml

- < bean >태그에 depends-on 애트리뷰트를 사용해 빈 의존성과 관련된 추가 정보를 스프링에게 제공할 수 있다. 
- 이 구성을 통해서 johnMayer빈이 gopher 빈에 의존한다는 것을 스프링에게 알린다. 
- 스프링은 빈 인스턴스를 생성할 때 이를 고려해야 하며 johnMayer보다 gopher를 먼저 생성해야 한다. 



## Annotation 방식의 의존성 해석

- 위의 코드를 annotation방식으로 바꾸면 다음과 같다.

```
package com.ch3.dependency.annotation;

import org.springframework.context.support.GenericXmlApplicationContext;

public class DependsDemo {
	public static void main(String[] args) {
		GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
		ctx.load("classpath:spring/app-context-04-annotated.xml");
		ctx.refresh();

		Singer johnMayer =  ctx.getBean("johnMayer", Singer.class);
		johnMayer.sing();

		ctx.close();
	}
}

```
DependsDemo.java
<br>
<br>


```
package com.ch3.dependency.annotation;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

@Component("johnMayer")
@DependsOn("gopher")
public class Singer implements ApplicationContextAware{

	ApplicationContext ctx;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.ctx = applicationContext;
	}

	private Guitar guitar;

	public Singer() {

	}

	public void sing() {
		guitar = ctx.getBean("gopher", Guitar.class);
		guitar.sing();
	}
}

```
Singer.java
<br>
<br>

```
package com.ch3.dependency.annotation;

import org.springframework.stereotype.Component;

@Component("gopher")
public class Guitar {

	public void sing() {

		System.out.println("Cm Eb Fm Ab Bb");

	}

}
```
Guitar.java
<br>
<br>
```
<?xml version="1.0" encoding="UTF-8"?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:util="http://www.springframework.org/schema/util"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
          http://www.springframework.org/schema/beans/spring-beans.xsd
          http://www.springframework.org/schema/context
          http://www.springframework.org/schema/context/spring-context.xsd
          http://www.springframework.org/schema/util
          http://www.springframework.org/schema/util/spring-util.xsd">

    <context:component-scan
            base-package="com.ch3.dependency.annotation"/>
 </beans>
```
app-context-04-context.xml

