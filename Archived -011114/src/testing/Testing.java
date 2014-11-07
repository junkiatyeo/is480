package testing;

import manager.OwnerManager;

public class Testing {
	public static void main(String[] args){
		System.out.println(OwnerManager.getOwnerByName("bieyaqing").toJson());
	}
}
