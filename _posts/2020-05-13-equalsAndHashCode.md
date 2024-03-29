---
layout: post
title:  "[ JAVA ]  equals()와 hashcode()로 객체 비교하기" 
date:   2020-05-13 00:00:00 
categories: JAVA
tags: JAVA
comments: 1
---
객체를 비교하는 데 없어서는 안될 메소드인 equals와 hashcode.
이 두 메소드의 관계는 무엇일까? 이것에 대해 알아보도록 하자. 
간략하게 한마디로 정리해 보자면 다음과 같다. <br>
> equals는 현재 객체와 넘겨진 객체를 비교한다. <br>
hashcode는 한 고유한 객체의 고유한 정수인 해시코드 값을 반환한다. 

equals와 hashcode메소드가 없다면 객체의 모든 필드를 비교하는 매우 많은 if문을 작성해야 할 것이다. 만일 그렇다면 코드가 매우 혼란스럽고 읽기 어려운 코드가 될 것이다. 
그러나 이 두 메소드 덕분에 더 유연하고 일관된 코드를 작성할 수 있다. 

### Overrding
메서드 Overriding은 다형성 활용을 위해 부모 클래스나 인터페이스의 동작을 하위클래스에서 재정의하는 기법이다. 
Java의 모든 객체에는 equals와 hashcode메소드가 포함되는데 이는 모든 클래스가 Object클래스를 상속하기 때문이다. 
우리가 원하는 객체비교 기능을 수행하려면 equals와 hashcode메소드를 재정의해야 한다. 

재정의하기 전에, core Java classes에 있는 equals메소드의 코드먼저 살펴보자. 

```
public boolean equals(Object obj) {
        return (this == obj);
}
```

hashcode 메서드도 마찬가지로 재정의되지 않으면 Object 클래스의 기본 메서드가 호출된다. 
이것은 C와 같은 다른 언어로 실행되고 객체의 메모리 주소와 관련된 일부 코드를 반환하는 네이티브 메서드이다. 
(JDK 코드를 작성하지 않는 한이 방법이 어떻게 작동하는지는 후일로 미뤄두자..)

```
@HotSpotIntrinsicCandidate
public native int hashCode();
```
native는 자바가 아닌 언어(보통 C나 C++)로 구현한 후 자바에서 사용하려고 할 때 이용하는 키워드이다. 
자바로 구현하기 까다로운 것을 다른 언어로 구현해서, 자바에서 사용하기 위한 방법이다. 구현할때 JNI(Java Native Interface)를 사용한다.

다시 말하지만, equals와 hashcode가 재정의되지 않으면, 
위에 있는 코드들이 호출이 된다. 
하지만 우리의 목적은 객체를 비교하기 위함이니 재정의는 필수적이다. 


equals메소드에서 두 객체가 같다면 hashcode도 동일한 정수값이어야 한다.
equals () 및 hashcode () 메서드가 재정의되지 않으면 Object클래스에 정의된 메소드가 호출된다.
이 경우 메서드는 둘 이상의 객체가 동일한 값을 갖는지 확인하는 equals () 및 hashcode ()의 실제 목적을 충족하지 않는다.
따라서 재정의는 꼭 필요하다. 
일반적으로 equals ()를 재정의 할 때 hashcode ()도 재정의해야 한다.

### equals()로 객체 비교
두 객체가 동일한지 확인하기 위해서 equals는 객체 속성값을 비교하도록 재정의한다. 
``` 
public class EqualsAndHashCodeExample {

    public static void main(String... equalsExplanation) {
        System.out.println(new Simpson("Homer", 35, 120)
                 .equals(new Simpson("Homer",35,120))); // true
        
        System.out.println(new Simpson("Bart", 10, 120)
                 .equals(new Simpson("El Barto", 10, 45)));  // false
        
        System.out.println(new Simpson("Lisa", 54, 60)
                 .equals(new Object()));  //false
    }
	
    static class Simpson {

        private String name;
        private int age;
        private int weight;

        public Simpson(String name, int age, int weight) {
            this.name = name;
            this.age = age;
            this.weight = weight;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (o == null || getClass() != o.getClass()) {
                return false;
            }
            Simpson simpson = (Simpson) o;
            return age == simpson.age &&
                    weight == simpson.weight &&
                    name.equals(simpson.name);
        }
    }
}
```
#### 비교 과정 
1. equals 첫번째 비교에서 현재 객체와 전달된 객체를 비교하고 같으면 true를 반환한다.
2. 두번째로 전달된 객체로 null인지 확인하고 다른 클래스로 입력이 됐는지 확인한다. 
3. 마지막으로 equals()는 객체의 필드를 비교한다. 두 객체에 동일한 필드 값이 있으면 객체는 동일하다고 판단한다. 

### equals vs ==연산자
느낌상으로는 두 요소가 비슷한 기능을 수행하는 것처럼 보이지만, 사실은 다르다. 
==연산자는 두 참조변수 안에 있는 참조가 동일한 객체를 가리키는 지 여부를 비교한다. 
 ```
 System.out.println(homer == homer2); // false
 ```

우리는 위에서 equals메소드를 필드값으로 비교하도록 재정의했다. 
따라서 결과는 아래와 같다. 
```
System.out.println(homer.equals(homer2)); //true
```

### hashcode로 객체를 Uniquely하게 식별할 수 있다.
객체를 비교할 때 성능을 최적화하기 위해 hashcode메서드를 사용한다. 
hashcode ()를 실행하면 프로그램의 각 객체에 대한 고유 ID가 반환되므로 객체의 전체 상태를 훨씬 쉽게 비교할 수 있다.
만일 어떤 객체의 해시코드값이 다른 객체의 해시코드값과 다르다면 equals메소드로 비교할 필요가 없다. 고민의 여지가 없이 두 객체는 다른 것이다. 
반대로, 해시코드값이 동일하다면 반드시 equals메소드를 통해서 필드가 동일한지 확인해야 한다. 

아래의 hashcode메소드 예시를 보자. 

```
public class HashcodeConcept {

    public static void main(String... hashcodeExample) {
        Simpson homer = new Simpson(1, "Homer");
        Simpson bart = new Simpson(2, "Homer");

        boolean isHashcodeEquals = homer.hashCode() == bart.hashCode();

        if (isHashcodeEquals) {
            System.out.println("Should compare with equals method too.");
        } else {
            System.out.println("Should not compare with equals method because " +
                    "the id is different, that means the objects are not equals for sure.");
        }
    }

     static class Simpson {
        int id;
        String name;

        public Simpson(int id, String name) {
            this.id = id;
            this.name = name;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Simpson simpson = (Simpson) o;
            return id == simpson.id &&
                    name.equals(simpson.name);
        }

        @Override
        public int hashCode() {
            return id;
        }
    }
}
```
위의 예시에서는 항상 동일한 값을 반환하는 hashcode를 구현했다.
이는 유효하지만 그다지 효과적이지 않다. 
이 경우 비교는 항상 true를 반환하므로 equals() 메서드가 항상 실행된다. 이러면 성능 향상이 없다. 


### 컬렉션과 함께 equals()와 hashcode() 사용하기
Set 인터페이스는 Set 서브 클래스에 중복 요소가 삽입되지 않도록 한다. 
다음은 Set 인터페이스를 구현한 클래스들이다.
- HashSet
- TreeSet
- LinkedHashSet
- CopyOnWriterArraySet

Set에는 중복되지 않는 유일한 요소만 삽입할 수 있기 때문에, HashSet 클래스에 엘리먼트를 넣기 위해서는
그 엘리먼트가 고유한지 판별을 위해서 equals와 hashcode메소드를 사용해야 한다. 
이 경우 equals () 및 hashcode () 메서드가 재정의되지 않은 경우 코드에 중복 요소가 삽입 될 위험이 있다.

아래 코드에서는 add 메소드를 사용하여 HashSet 개체에 새 요소를 추가한다. 
새 요소가 추가되기 전에 HashSet은 해당 요소가 지정된 컬렉션에 이미 존재하는지 확인한다.

```
if (e.hash == hash && ((k = e.key) == key || (key != null && key.equals(k))))
       break;
       p = e; 
```


> **Hash Collection관련 팁**   
오직 set만이 equals와 hashcode를 사용하는 컬렉션은 아니다.    
HashMap, Hashtable 및 LinkedHashMap에도 이러한 메서드가 필요하고 사용된다. 
일반적으로 "Hash"라는 접두사가있는 컬렉션인 경우 해당 기능이 제대로 작동하도록하려면 hashcode () 및 equals () 메서드를 재정의해야한다.



### 사용 가이드라인 - 어떻게 써야할까?   

#### 1. 동일한 고유 해시 코드 ID를 가진 객체에 대해서만 equals메서드를 실행해야한다.   
해시코드가 다른데 필드값만 같다면 equals메소드가 true를 리턴할 것이다.    
아래의 정리된 표를 보자.    
    
|  hashcode로 객체 비교  |   
|hashcode 비교 결과|그에 따른 수행 로직|
|:------:|:------:|   
|return true|execute equals()|   
|returns false|do not execute equals()|
   
<br>
####  2. hashcode() 비교가 false를 반환하면 equals() 메서드도 false를 반환해야 한다.    
      
|  hashcode로 객체 비교  |   
|hashcode 리턴 값|equals메소드가 리턴해야하는 값|
|:------:|:------:|   
|true|true or false|   
|false|false|
        
####  3. equals() 메서드가 true를 반환하면 객체가 모든 값과 속성에서 동일 함을 의미한다. 이 경우 해시 코드 비교도 true여야 한다.
      
|  equals로 객체 비교  |   
|equals 리턴 값|hashcode메소드가 리턴해야하는 값|
|:------:|:------:|   
|true|true|   
|false|true or false|
        
> 참고 : https://www.infoworld.com/article/3305792/comparing-java-objects-with-equals-and-hashcode.html


