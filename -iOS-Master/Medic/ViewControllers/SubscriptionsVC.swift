//  MIT License

//  Copyright (c) 2017 Haik Aslanyan

//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:

//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.

//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.

import UIKit

class SubscriptionsVC: UIViewController {
    var temp = 0
    @IBOutlet weak var unlockButton: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        unlockButton.imageView?.contentMode = .scaleAspectFit
    }
    @IBAction func playPressed(_ sender: Any) {
        let tuto1 = UIImage(named: "tuto1") as! UIImage
        let tuto2 = UIImage(named: "tuto2")
        let tuto3 = UIImage(named: "tuto3")
        let tuto4 = UIImage(named: "tuto4")
        let tuto5 = UIImage(named: "tuto5")
        if(temp == 0){
            unlockButton.setImage(tuto1.withRenderingMode(.alwaysOriginal), for: .normal)
            temp = 1
        }else  if(temp == 1){
            unlockButton.setImage(tuto2, for: UIControlState.normal)
            temp = 2
        }else  if(temp == 2){
            unlockButton.setImage(tuto3, for: UIControlState.normal)
            temp = 3
        }else  if(temp == 3){
            unlockButton.setImage(tuto4, for: UIControlState.normal)
            temp = 4
        }else{
            unlockButton.setImage(tuto5, for: UIControlState.normal)
            temp = 0
        }
        
    }
}
 
