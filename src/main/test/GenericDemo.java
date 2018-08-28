import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.function.Consumer;

public class GenericDemo<T> {

    public static void main(String[] args) {
        GenericEntity genericEntity = new GenericEntity<String>();
        genericEntity.add("jack");
        genericEntity.add("tom");

        System.out.println(genericEntity.get(0));
        System.out.println(genericEntity.get(1));


        List<GenericFather> glist = new LinkedList<GenericFather>();
        glist.add(new GenericFather());
        glist.add(new GenericSon());
        print(glist);

        List<GenericSon> glist2 = new LinkedList<GenericSon>();
        print2(glist2);

        List<? super GenericFather> list = new LinkedList<GenericFather>();
        print3(list);
    }
    
    public static void print(List<? extends GenericFather> list){
        for (GenericFather genericFather : list) {
            genericFather.print();
        }
    }
    
    public static void print2(List<GenericSon> list){
        for (GenericFather genericFather : list) {
            genericFather.print();
        }
    }

    public static void print3(List<? super GenericFather> list){
        list.add(new GenericFather());
        list.add(new GenericSon());
        
        for (Object o : list) {
            System.out.println(o.toString());
        }
    }
}

class GenericEntity<T>{
    
    public Object[] objects = new Object[50];
    public int size;
    
    public void add(T t){
        objects[size++] = t;
    }
    
    public T get(int index){
        return (T) objects[index];
    }
}
