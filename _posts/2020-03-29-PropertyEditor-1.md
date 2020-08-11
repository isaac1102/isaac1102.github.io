---
layout: post
title:  "PropertyEditor"
date:   2020-04-03 00:00:07
categories: SPRING
tags: FactoryBean SPRING
---

* content
{:toc}

PropertyEditor는 프로퍼티 값을 원래 자료 타입에서 String으로 변환하거나 반대로 String값을 원래 타입으로 변환하는 인터페이스다.<br>
스프링에서 많이 쓰인다.<br>
스프링에서는 대부분의 빈 프로퍼티 값이 String일 경우가 많지만, 아닐 경우에 String 기반 프로퍼티 값을 적정타입으로 변환할 수 있도록
PropertyEditor가 변환을 도와서 번거로움을 덜어준다. 


## 사용하기(4.7.1)

```
package com.ch4.propertyEditor;

import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.util.*;
import java.util.regex.Pattern;
import java.text.SimpleDateFormat;
import org.springframework.beans.PropertyEditorRegistrar;
import org.springframework.beans.PropertyEditorRegistry;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;

import org.springframework.context.support.GenericXmlApplicationContext;

public class PropertyEditorBean {
    private byte[] bytes;                 // ByteArrayPropertyEditor
    private Character character;          //CharacterEditor
    private Class cls;                    // ClassEditor
    private Boolean trueOrFalse;          // CustomBooleanEditor
    private List<String> stringList;      // CustomCollectionEditor
    private Date date;                    // CustomDateEditor
    private Float floatValue;             // CustomNumberEditor
    private File file;                    // FileEditor
    private InputStream stream;           // InputStreamEditor
    private Locale locale;                // LocaleEditor
    private Pattern pattern;              // PatternEditor
    private Properties properties;        // PropertiesEditor
    private String trimString;            // StringTrimmerEditor
    private URL url;                      // URLEditor

    public void setCharacter(Character character) {
        System.out.println("Setting character: " + character);
        this.character = character;
    }

    public void setCls(Class cls) {
        System.out.println("Setting class: " + cls.getName());
        this.cls = cls;
    }

    public void setFile(File file) {
        System.out.println("Setting file: " + file.getName());
        this.file = file;
    }

    public void setLocale(Locale locale) {
        System.out.println("Setting locale: " + locale.getDisplayName());
        this.locale = locale;
    }

    public void setProperties(Properties properties) {
        System.out.println("Loaded " + properties.size() + " properties");
        this.properties = properties;
    }

    public void setUrl(URL url) {
        System.out.println("Setting URL: " + url.toExternalForm());
        this.url = url;
    }

    public void setBytes(byte... bytes) {
        System.out.println("Setting bytes: " + Arrays.toString(bytes));
        this.bytes = bytes;
    }

    public void setTrueOrFalse(Boolean trueOrFalse) {
        System.out.println("Setting Boolean: " + trueOrFalse);
        this.trueOrFalse = trueOrFalse;
    }

    public void setStringList(List<String> stringList) {
        System.out.println("Setting string list with size: "
            + stringList.size());

        this.stringList = stringList;

        for (String string: stringList) {
            System.out.println("String member: " + string);
        }
    }

    public void setDate(Date date) {
        System.out.println("Setting date: " + date);
        this.date = date;
    }

    public void setFloatValue(Float floatValue) {
        System.out.println("Setting float value: " + floatValue);
        this.floatValue = floatValue;
    }

    public void setStream(InputStream stream) {
        System.out.println("Setting stream: " + stream);
        this.stream = stream;
    }

    public void setPattern(Pattern pattern) {
        System.out.println("Setting pattern: " + pattern);
        this.pattern = pattern;
    }

    public void setTrimString(String trimString) {
        System.out.println("Setting trim string: " + trimString);
        this.trimString = trimString;
    }

    public static class CustomPropertyEditorRegistrar implements PropertyEditorRegistrar {
        @Override
        public void registerCustomEditors(PropertyEditorRegistry registry) {
            SimpleDateFormat dateFormatter = new SimpleDateFormat("MM/dd/yyyy");
            registry.registerCustomEditor(Date.class,
                     new CustomDateEditor(dateFormatter, true));

            registry.registerCustomEditor(String.class, new StringTrimmerEditor(true));
        }
    }

    public static void main(String... args) throws Exception {
        File file = File.createTempFile("test", "txt");
        file.deleteOnExit();

        GenericXmlApplicationContext ctx = new GenericXmlApplicationContext();
        ctx.load("classpath:spring/app-context-01.xml");
        ctx.refresh();

        PropertyEditorBean bean =
            (PropertyEditorBean) ctx.getBean("builtInSample");

        ctx.close();
    }
}
```
PropertyEditorBean.java
<br>


결과값
```
Setting bytes: [74, 111, 104, 110, 32, 77, 97, 121, 101, 114]
Setting character: A
Setting class: java.lang.String
Setting date: Wed May 03 00:00:00 KST 13
Setting file: test.txt
Setting float value: 123.45678
Setting locale: 영어 (미국)
Setting pattern: a*b
Loaded 1 properties
Setting stream: java.io.BufferedInputStream@6ee12bac
Setting string list with size: 2
String member: String member 1
String member: String member 2
Setting trim string: String need trimming
Setting Boolean: true
Setting URL: https://spring.io/
```
<br>
<br>


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
        class="org.springframework.beans.factory.config.CustomEditorConfigurer"
        p:propertyEditorRegistrars-ref="propertyEditorRegistrarsList"/>

    <util:list id="propertyEditorRegistrarsList">
        <bean class="com.ch4.propertyEditor.PropertyEditorBean$CustomPropertyEditorRegistrar"/>
    </util:list>

    <bean id="builtInSample" class="com.ch4.propertyEditor.PropertyEditorBean"
        p:character="A"
        p:bytes="John Mayer"
        p:cls="java.lang.String"
        p:trueOrFalse="true"
        p:stringList-ref="stringList"
        p:stream="test.txt"
        p:floatValue="123.45678"
        p:date="05/03/13"
        p:file="#{systemProperties['java.io.tmpdir']}#{systemProperties['file.separator']}test.txt"
        p:locale="en_US"
        p:pattern="a*b"
        p:properties="name=Chris age=32"
        p:trimString="   String need trimming   "
        p:url="https://spring.io/"
    />

    <util:list id="stringList">
        <value>String member 1</value>
        <value>String member 2</value>
    </util:list>
</beans>
```
