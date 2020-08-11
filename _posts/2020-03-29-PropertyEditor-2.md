---
layout: post
title:  "커스텀 PropertyEditor 만들기"
date:   2020-04-03 00:00:07
categories: SPRING
tags: PropertyEditor SPRING
---

* content
{:toc}

스프링은 커스텀 PropertyEditor의 등록과 사용을 지원한다. <br>
Java5 이후 버전은 PropertyEditorSupport를 제공해 커스텀 PropertyEditor가 이를 상속할 수 있으며 
setAsText() 메서드를 구현하면 된다. 

```
package com.ch4.propertyEditor.custom;

public class FullName {
	private String firstName;
	private String lastName;

	public FullName(String firstName, String lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String toString() {
		return "이름 : " + firstName + " - 성 : " + lastName;
	}
}
```
FullName.java
firstName과 lastName을 갖는 단순한 클래스이다.

<br>


```
package com.ch4.propertyEditor.custom;

import java.beans.PropertyEditorSupport;

public class NamePropertyEditor extends PropertyEditorSupport{

	@Override
	public void setAsText(String text) throws IllegalArgumentException {
		String[] name = text.split("\\s");

		setValue(new FullName(name[0], name[1]));
	}
}
```
NamePropertyEditor.java

애플리케이션에서 NamePropertyEditor를 사용하려면 NamePropertyEditor를 스프링의 ApplicationContext에 등록해야 한다. 


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

    <bean id="customEditorConfigurer"
        class="org.springframework.beans.factory.config.CustomEditorConfigurer">
    	<property name="customEditors">
    		<map>
    			<entry key="com.ch4.propertyEditor.custom.FullName" value="com.ch4.propertyEditor.custom.NamePropertyEditor"/>
    		</map>
    	</property>
    </bean>

    <bean id="exampleBean" class="com.ch4.propertyEditor.custom.CustomEditorExample" p:name="John Mayer"/>
</beans>
```
