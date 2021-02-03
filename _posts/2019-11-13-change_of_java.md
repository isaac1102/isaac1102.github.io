---
layout: post
title:  "[ JAVA ] java7에서 변경된 사항들"
date:   2019-11-13 00:00:07
categories: TIL
tags: JAVA TIL
---

* content
{:toc}

초기버전의 java를 쭉 사용해 왔다면, 하나하나 기능이 추가될 때마다 그 유용함과 편리함을 몸소 체험했겠지만,
그동안 개발을 하면서 사용한 버전이 6이나 7이 대부분이었다보니 그럴 일이 없었던 것 같다.
그런 의미에서 java7에 오면서 새롭게 추가되거나 변경된 사항들에 대해서 살펴보려 한다. 

## java7에 변경된 것들
###  숫자 표시 방법 보완
- 이전 버전까지는 0을 앞에 넣으면 8진수, 0x를 앞에 넣으면 16진수로 인식하는 것이 가능했다. java7부터는 아무 접두사가 없는 숫자는 10진수, 0b를 앞에 넣으면 2진수로 인식하는 것이 추가됐다.
- _를 사용하여 숫자의 단위를 잘라서 표현할 수 있다. 가독성이 좋아졌다. 
###  switch문에서 String 사용
- java6까지는 switch-case에서 정수형만 사용가능했었다. 7부터 String도 사용이 가능하다. 

### 제네릭을 쉽게 사용할 수 있는 Diamond
- 기존에는 제네릭 사용 시에 <>안에 타입을 입력했어야 했다. 7부터는 그럴 필요가 없다. 왜냐하면 이미 변수 선언부에서 타입을 지정해놨기 때문이다. 

### 예외가 보완되었다.(1)
이전까지는 예외처리르 ㄹ위해 try-catch문장을 사용했다. 이 부분에서 catch로 잡아주는 코드의 가독성이 떨어졌다. 
```
    public void scanFile(String fileName, String encoding){
    	Scanner scanner = null;
    	try{
    	    scanner = new Scanner(new File(fileName), encoding);
    	    System.out.println(scanner.nextLine());
    	}catch(IllegalAccessException iae){
    	    iae.printStackTrace();
    	}catch(FileNotFoundException ffe){
    	    ffe.printStackTrace();
    	}catch(NullPointerException npe){
    	    npe.printStackTrace();
    	}catch(Exception e){
    	    e.printStackTrace();
    	}finally{
    	    if(scanner != null){
    		scanner.close();
            }
    	}
    }
```
위의 예시를 보면 파일명이 한글일 경우 타입명시를 해줘야 한다. 인코딩 타입이 존재하지 않을 경우에, IllegalArgumentException이 발생할 것이고, 파일이 존재하지 않을 경우에는 FileNotFoundException이 발생할 것이다. 파일명이나 인코딩 타입이 NullPointerException이 발생할 수 있다. 
지금까지는 일일이 발생할 만한 case에 맞춰서 catch블록을 만들어 처리하고, 마지막에 Exception 클래스로 catch해주는 것이 일반적이었다. 

그러나 이제 java7부터는 다음과 같이 처리할 수 있다.
```
    public void newScanFile(String fileName, String encoding){
    	Scanner scanner = null;
    	try{
    	    scanner = new Scanner(new File(fileName), encoding);
    	    System.out.println(scanner.nextLine());
    	}catch(IllegalArgumentException | FileNotFoundException | NullPointerException exception){
    	    exception.printStackTrace();
    	}finally{
    	    if(scanner != null){
    		scanner.close();
            }
    	}	
    }
```    

### 예외가 보완되었다.(2)
try-with-resource(리소스와 함께 처리하는 try문장)이다.
아래 예시를 보자. 

```

  public void newScanFileTryWithResource(String fileName, String encoding){
      try(Scanner scanner = new Scanner(new File(fileName), encoding)){
          System.out.println(scanner.nextLine());
      }catch(IllegalArgumentException | FileNotFoundException | NullPointerException exception){
      exception.printStackTrace();
      }	
  }
```
이 구문의 특징은 다음과 같다.
- try의 소괄호 내에서 예외가 발생할 수 있는 객체에서, close()를 이용해 닫아야할 필요가 있을 때, AutoCloseable을 구현한 객체는 finally문장에서 별도로 처리할 필요가 없다는 것을 볼 수 있다. (AutoCloseable에 대해서는 아래에서 이어 말하겠다. )




### AutoCloseable
java5부터 추가된 java.io.Closeable인터페이스를 구현한 클래스들은 명시적으로 close()메소드를 사용하여 닫아줘야했지만, 
java7에 추가된 AutoCloseable 인터페이스를 상속한 클래스들은 앞서 살펴본 try-with-resource구문을 사용할 수 있다. 
AutoCloseable을 상속한 클래스들은 아래와 같다. (이외에도 많다.)
- java.nio.channels.FileLock
- java.beans.XMLEncoder
- java.beans.XMLDecoder
- java.io.ObjectInput
- java.io.ObjectOutput
- java.util.Scanner
- java.sql.Connection
- java.sql.ResultSet
- java.sql.Statement




> 출처 : 자바의 신(이상민 저)