---
layout: post
title:  "잘 몰랐던 스프링 Annotaion정리"
date:   2001-04-15 00:00:07
categories: SPRING
tags: SPRING
comments: 1
---
### @Component   
@Component 는 Spring이 사용자 정의 Bean을 자동으로 감지 할 수 있도록하는 주석이다.   
즉, 명시적인 코드를 작성할 필요없이 Spring은 다음을 수행한다.    
- @Component가 표시된 클래스는 빈 스캐너를 통해 자동으로 빈으로 등록된다. 
- 인스턴스화하고 지정된 종속성을 삽입하도록 한다. 
- @Component뿐 아니라 @Component를 메타 어노테이션으로 갖고 있는 어노테이션이 붙은 클래스가 자동으로 빈 등록 대상이 된다. 
  - Spring 주석들 중 @Controller, @Service, @Repository와 같은 어노테이션들이  @Component와 같은 기능을 가진다. 
  - 모두 동일한 기능을 가지는 이유는 @Component를 각각에 대해 메타 주석으로 구성한 어노테이션들이기 때문이다. 그렇게 되면 @Component의 별칭과 같이 사용될 수 있다.   

@Component를 사용하여 빈 자동등록을 하게 하려면, 빈 스캔 기능을 사용하겠다는 어노테이션 정의가 필요한데, @ComponentScan이 그 기능을 수행한다. 
지정된 패키지를 순회하다가 @Component가 붙은 클래스가 발견되면 새로운 빈으로 자동 추가한다. 이렇게 생성되는 빈은 아이디를 따로 지정하지 않으면 클래스 이름의 첫글자를 소문자로 바꾸어서 사용된다. 


### 스프링의 프로파일과 @Profile

### 프로퍼티 소스 @PropertySource
- Spring의 Environment에 PropertySource를 추가하기위한 편리하고 선언적인 메커니즘을 제공하는 주석. @Configuration 클래스와 함께 사용된다.
- 아래의 코드를 보면, app.properties라는 설정파일로부터 testbean.name의 키에 해당하는 값을 가지고 오는 것을 알 수 있다. 
```
@Configuration
@PropertySource("classpath:/com/myco/app.properties")
public class AppConfig {

     @Autowired
     Environment env;

     @Bean
     public TestBean testBean() {
         TestBean testBean = new TestBean();
         testBean.setName(env.getProperty("testbean.name"));
         return testBean;
     }
}
```
Environment 객체는 구성 클래스에 @Autowired되어 TestBean 객체를 채울 때 사용된다. 위의 구성에서 testBean.getName ()을 호출하면 "myTestBean"이 반환된다.   


### @Enable	
Spring에는 개발자가 Spring 애플리케이션을 쉽게 구성 할 수 있도록하는 @Enable 주석 세트가 함께 제공된다. 이러한 주석은 @Configuration 주석과 함께 사용된다.
종류는 아래와 같다.    

- @EnableWebMvc
	- @EnableWebMvc 주석은 애플리케이션에서 Spring MVC를 활성화하는 데 사용되며 WebMvcConfigurationSupport에서 Spring MVC 구성을 가져 와서 작동한다. 
	- 유사한 기능을 가진 XML은 <mvc : annotation-driven />이다.
- @EnableCaching
- @EnableScheduling
- @EnableAsync
- @EnableWebSocket
- @EnableJpaRepositories
- @EnableTransactionManagement
- @EnableJpaAuditing

(작성중 - 여기서 정리할 것 https://www.baeldung.com/spring-enable-annotations)

@Service
@Repository
@Import

### 메타 어노테이션
다음과 같은 인터페이스 정의가 있다.
```
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CustomAnnotation {
	boolean isCheck() default true;
}
```
위의 예시는 메타 어노테이션을 이용한 커스텀 어노테이션을 작성한 것이다. 
메타 어노테이션의 종류를 살펴보자.
* <strong>종류</strong>
- @Retention 
  - 자바 컴파일러가 어노테이션을 다루는 방법을 기술하며, 영향을 미치는 특정 시점을 설정한다. 
    - RetentionPolicy.SOURCE : 컴파일 전까지만 유효(컴파일 이후에는 사라짐)
    - RetentionPolicy.CLASS : 컴파일러가 클래스를 참조할 때까지 유효.
    - RetentionPolicy.RUNTIME : 컴파일 이후에도 JVM에 의해 계속 참조가 가능(리플렉션 사용)
- @Target
	- 어노테이션이 적용될 위치를 설정한다.
	- 종류는 다음과 같다
	 	- ElementType.PACKAGE : 패키지 선언
		- ElementType.TYPE : 타입 선언
		- ElementType.ANNOTATION_TYPE : 어노테이션 타입 선언
		- ElementType.CONSTRUCTOR : 생성자 선언
		- ElementType.FIELD : 멤버 변수 선언
		- ElementType.LOCAL_VARIABLE : 지역 변수 선언
		- ElementType.METHOD : 메서드 선언
		- ElementType.PARAMETER : 전달인자 선언
		- ElementType.TYPE_PARAMETER : 전달인자 타입 선언
		- ElementType.TYPE_USE : 타입 선언

- @Documented
	- 해당 어노테이션을 Javadoc에 포함시킨다.
- @Inherited
	- 어노테이션을 상속 가능하게 한다.
- @Repeatable
	- Java8부터 지원되며, 연속적으로 어노테이션을 선언할 수 있게 한다. 

어노테이션은 기본적으로 인터페이스 형태를 취한다.  그러므로  interface 앞에 @를 표시하면 된다. 
어노테이션의 필드에서는 enum, String이나 기본 자료형, 기본 자료형의 배열을 사용할 수 있습니다.

