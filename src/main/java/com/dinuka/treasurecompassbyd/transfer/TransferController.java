package com.dinuka.treasurecompassbyd.transfer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransferController {

    @Autowired
    private TransferDao transferDao;

    // to save the trfr info
    @PostMapping("/trfr/save")
    public String saveTransferInfo(@RequestBody Transfer trfrEntity) {

        try {

            trfrEntity.setStatus(true);
            transferDao.save(trfrEntity);
            return "OK";
        } catch (Exception e) {
            return "Save Not Completed Because :" + e.getMessage();
        }

    }

    // to update trfr info
    @PutMapping("/trfr/update")
    public String updateTransferInfo(@RequestBody Transfer trfrEntityPut) {

        try {
            transferDao.save(trfrEntityPut);
            return "OK";
        } catch (Exception e) {
            return "Update Not Completed Because :" + e.getMessage();
        }

    }

    // to delete a trfr record
    @DeleteMapping("/trfr/delete")
    public String deleteTransferInfo(@RequestBody Transfer trfrEntityDelete) {

        try {
            trfrEntityDelete.setStatus(false);
            transferDao.delete(transferDao.getReferenceById(trfrEntityDelete.getId()));

            // transferDao.save(trfrEntityDelete);

            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed " + e.getMessage();
        }
    }

}
